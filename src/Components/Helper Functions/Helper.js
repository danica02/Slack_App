import API from "../../API";

export function responseHeaders() {
  const heads = JSON.parse(localStorage.getItem("userheaders"));
  return heads;
}

export async function getUsers() {
  try {
    const { data } = await API.get("users", {
      headers: responseHeaders(),
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

