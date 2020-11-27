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

const complete = async (params, credential, updatedData) => {
  try {
    let res = await fetch("/api/enrollment/complete/" + params.enrollmentId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credential.t,
      },
      body: JSON.stringify(updatedData),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const listEnrolled = async (credential, signal) => {
  try {
    let res = await fetch("/api/enrollment/enrolled", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credential.t,
      },
      signal: signal,
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export { listEnrolled, create, read, complete };
