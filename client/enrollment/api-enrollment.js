const create = async (params, credential) => {
  try {
    const response = await fetch("/api/enrollment/new/" + params.courseId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credential.t,
      },
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, credential, signal) => {
  try {
    const response = await fetch("/api/enrollment/" + params.enrollmentId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credential.t,
      },
      signal: signal,
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create, read };
