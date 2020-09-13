const create = async (params, credential, course) => {
  try {
    let response = await fetch("/api/courses/by/" + params.userId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credential.t,
      },
      body: course,
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const listByInstructor = async (params, credential, signal) => {
  try {
    let response = await fetch("/api/courses/by/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credential.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
export { create, listByInstructor };
