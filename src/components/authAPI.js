// import API from "../api";


// API.interceptors.request.use(async (config) => {
//   const access = localStorage.getItem("access");
//   if (access) {
//     config.headers.Authorization = `Bearer ${access}`;
//   }
//   return config;
// });

// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       localStorage.getItem("refresh")
//     ) {
//       originalRequest._retry = true;
//       try {
//         const { data } = await API.post("api/token/refresh/", {
//           refresh: localStorage.getItem("refresh"),
//         });
//         localStorage.setItem("access", data.access);
//         API.defaults.headers.common["Authorization"] = "Bearer " + data.access;
//         return API(originalRequest);
//       } catch (err) {
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;
