const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const update = async (userId, id, feedback, ids = []) => {
  console.log("updating");
  console.log(id);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, id, feedback, ids }),
  };
  const response = await fetch(`${BASE_URL}/update`, requestOptions);
  if (response.status === 201) {
    console.log("update succeeded");
  }
  return;
};

const recommend = async (userId) => {
  console.log("fetching recommendation");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  };
  const response = await fetch(`${BASE_URL}/recommend`, requestOptions);
  const new_recommendation = await response.json();
  console.log("new recommendation: ", new_recommendation);
  return new_recommendation;
};

const search = async (search_string, cb) => {
  console.log("searching: ", search_string);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: search_string }),
  };
  const response = await fetch(`${BASE_URL}/search`, requestOptions);
  const new_search_results = await response.json();
  cb(new_search_results);
  return new_search_results;
};

async function getToken(userId) {
  try {
    const response = await fetch(`${BASE_URL}/auth/token`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    console.log(response);
    const json = await response.json();
    console.log(json);
    return json.access_token;
  } catch (e) {
    console.log(e);
    return "";
  }
}

const refreshToken = async (userId) => {
  const response = await fetch(`${BASE_URL}/refresh_token`, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  const json = await response.json();
  return json.access_token;
};
console.log(process.env.NODE_ENV);
export default { update, recommend, search, getToken, refreshToken };
