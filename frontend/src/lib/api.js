import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const getLive = () => axios.get(`${API}/live`).then((r) => r.data);
export const getSchedule = () => axios.get(`${API}/schedule`).then((r) => r.data);
export const getShows = (category) =>
  axios.get(`${API}/shows`, { params: category ? { category } : {} }).then((r) => r.data);
export const getShow = (slug) => axios.get(`${API}/shows/${slug}`).then((r) => r.data);
export const getProjects = (category) =>
  axios.get(`${API}/projects`, { params: category ? { category } : {} }).then((r) => r.data);
export const getProject = (slug) => axios.get(`${API}/projects/${slug}`).then((r) => r.data);
export const getResidents = () => axios.get(`${API}/residents`).then((r) => r.data);
export const postSubmission = (payload) =>
  axios.post(`${API}/submissions`, payload).then((r) => r.data);
