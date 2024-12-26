$(function () {
  class GithubAPI {
    static API_BASE_URL = 'https://api.github.com';
    static AUTH_ENDPOINT =
      'https://forresto-meemoo_org_share.web.val.run/login';

    _token = undefined;
    _currentUser = undefined;
    _loadedGistId = undefined;
    _loadedGistResponse = undefined;

    constructor() {
      this._token = localStorage.getItem('meemoo_gist_token');
      if (this._token) {
        // Load user data on init if logged in
        this.loadCurrentUser();
      }

      window.addEventListener('hashchange', () => {
        const currentHash = window.location.hash;
        if (!currentHash.startsWith('#gist/')) {
          this.clearCache();
        }
      });
    }

    isLoggedIn() {
      return Boolean(this._token);
    }

    login() {
      const redirectUri = encodeURIComponent(window.location.href);
      window.location.href = `${GithubAPI.AUTH_ENDPOINT}?redirect=${redirectUri}`;
    }

    logout() {
      this._token = undefined;
      localStorage.removeItem('meemoo_gist_token');
      this._currentUser = undefined;
      this.emitLoginStatusChange();
    }

    emitLoginStatusChange() {
      const event = new CustomEvent('github-login-status-changed', {
        detail: {
          isLoggedIn: this.isLoggedIn(),
        },
      });
      window.dispatchEvent(event);
    }

    handleCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const githubToken = urlParams.get('token');

      if (githubToken) {
        this._token = githubToken;
        localStorage.setItem('meemoo_gist_token', githubToken);
        // Replace current history entry with clean URL, omitting search params
        const cleanUrl =
          window.location.origin +
          window.location.pathname +
          window.location.hash;
        history.replaceState(null, '', cleanUrl);
        this.emitLoginStatusChange();
        return true;
      }
      return false;
    }

    async loadCurrentUser() {
      try {
        this._currentUser = await this.getCurrentUser();
      } catch (err) {
        console.error('Failed to load GitHub user:', err);
        this._currentUser = null;
        // Token might be invalid
        this.logout();
      }
      this.emitLoginStatusChange();
    }

    async getCurrentUser() {
      const response = await $.ajax({
        url: GithubAPI.API_BASE_URL + '/user',
        type: 'GET',
        headers: {
          Authorization: 'token ' + this._token,
        },
      });
      return response;
    }

    async canUpdateCurrentGist() {
      if (!this.isLoggedIn() || !this._currentUser) return false;

      const currentHash = window.location.hash;
      const gistMatch = currentHash.match(/^#gist\/([a-f0-9]+)/);
      if (!gistMatch) return false;

      try {
        const gist = await this.getGist(gistMatch[1]);
        return this._currentUser.login === gist.owner.login;
      } catch (err) {
        console.error('Failed to check gist ownership:', err);
        return false;
      }
    }

    async getGist(gistId) {
      if (!gistId) {
        throw new Error('Gist ID is required');
      }
      if (gistId === this._loadedGistId) {
        return this._loadedGistResponse;
      }
      try {
        const headers = this._token
          ? {Authorization: 'token ' + this._token}
          : {};

        const response = await $.ajax({
          url: `${GithubAPI.API_BASE_URL}/gists/${gistId}`,
          type: 'GET',
          headers,
        });

        // Cache the successful response
        this._loadedGistId = gistId;
        this._loadedGistResponse = response;
        return response;
      } catch (err) {
        // Clear cache on error
        this.clearCache();

        // Handle specific error cases
        if (err.status === 404) {
          throw new Error(`Gist ${gistId} not found`);
        }
        if (err.status === 403) {
          throw new Error('Rate limit exceeded or access denied');
        }

        // Re-throw other errors with more context
        throw new Error(`Failed to fetch gist: ${err.message}`);
      }
    }

    clearCache() {
      this._loadedGistId = undefined;
      this._loadedGistResponse = undefined;
    }

    async createGist(data) {
      if (!this._token) {
        throw new Error('Authentication token required');
      }
      try {
        return await $.ajax({
          url: GithubAPI.API_BASE_URL + '/gists',
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          headers: {
            Authorization: 'token ' + this._token,
          },
          data: JSON.stringify(data),
        });
      } catch (err) {
        if (err.status === 401) {
          throw new Error('Invalid authentication token');
        }
        if (err.status === 403) {
          throw new Error('Rate limit exceeded or access denied');
        }
        throw new Error(`Failed to create gist: ${err.message}`);
      }
    }

    async updateGist(gistId, data) {
      if (!gistId) {
        throw new Error('Gist ID is required');
      }
      if (!this._token) {
        throw new Error('Authentication token required');
      }

      try {
        return await $.ajax({
          url: `${GithubAPI.API_BASE_URL}/gists/${gistId}`,
          type: 'PATCH',
          dataType: 'json',
          contentType: 'application/json',
          headers: {
            Authorization: 'token ' + this._token,
          },
          data: JSON.stringify(data),
        });
      } catch (err) {
        if (err.status === 404) {
          throw new Error(`Gist ${gistId} not found`);
        }
        if (err.status === 401) {
          throw new Error('Invalid authentication token');
        }
        if (err.status === 403) {
          throw new Error('Rate limit exceeded or access denied');
        }
        throw new Error(`Failed to update gist: ${err.message}`);
      }
    }

    async saveGraph(graph) {
      if (!this.isLoggedIn()) {
        throw new Error('Must be logged in to save gist');
      }
      if (!graph) {
        throw new Error('Graph data is required');
      }
      if (!graph.info) {
        throw new Error('Graph info is missing');
      }

      const currentHash = window.location.hash;
      const gistMatch = currentHash.match(/^#gist\/([a-f0-9]+)/);

      // Only allow updates if we're on a #gist/ URL
      const existingGistId = gistMatch ? gistMatch[1] : null;

      const filename = (graph.info.url || 'untitled') + '.meemoo.json';
      const files = {
        [filename]: {
          content: JSON.stringify(graph, null, 2),
        },
      };

      const data = {
        description: graph.info.title,
        public: true,
        files: files,
      };

      let response;

      if (existingGistId) {
        // Check ownership before updating
        const gist = await this.getGist(existingGistId);
        const user = await this.getCurrentUser();
        const isOwner = user.login === gist.owner.login;

        if (isOwner) {
          // Update existing gist
          data.description = `${graph.info.title} – https://app.meemoo.org/#gist/${existingGistId}`;
          response = await this.updateGist(existingGistId, data);
        } else {
          // Create new gist if not owner
          response = await this.createGist(data);
        }
      } else {
        // Create new gist
        response = await this.createGist(data);
      }

      return response;
    }
  }

  window.MeemooGithubAPI = GithubAPI;
});
