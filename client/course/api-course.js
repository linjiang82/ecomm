const create = async (params, credential, course) => {
  try {
    let response = await fetch("/api/courses/by" + params.userId, {
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

export { create };
