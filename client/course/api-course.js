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
const update = async (params, credential, course) => {
  try {
    let response = await fetch("/api/course/" + params.courseId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credential.t,
      },
      body: course,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const listPublished = async (signal) => {
  try {
    let response = await fetch("/api/courses/published", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: signal,
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};
const newLesson = async (params, credential, lesson) => {
  try {
    let response = await fetch(
      "/api/courses/" + params.courseId + "/lesson/new",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credential.t,
        },
        body: JSON.stringify(lesson),
      }
    );
    return await response.json();
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

const removeCourse = async (params, credential) => {
  try {
    let response = await fetch("/api/course/" + params.courseId, {
      method: "DELETE",
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
const listCourse = async (params, signal) => {
  try {
    let response = await fetch("/api/course/" + params.courseId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
export {
  create,
  listByInstructor,
  listCourse,
  newLesson,
  update,
  removeCourse,
  listPublished,
};
