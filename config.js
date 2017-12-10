//account credentials required for resource-owner based authentication flow
module.exports = {
  'port': 5001,
  'grant_type': 'password',
  'accessTokenUrl': "https://na.airvantage.net/api/oauth/token",
  'username': "<airvantage username>",
  'password': "<airvantage account password>",
  'client_id': "<airvantage api client_id>",
  'client_secret':  "<airvantage api client_secret>"
};
