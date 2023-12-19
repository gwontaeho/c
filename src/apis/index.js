import axios from "axios";

const axiosInstance = axios.create({ baseURL: "/api" });

export const createJob = async (values) => {
    const { data } = await axiosInstance.post("/jobs", values);
    return data;
};

export const getJobs = async ({ sido, perPage, page }) => {
    const { data } = await axiosInstance.get(`/jobs?sido=${sido}&perPage=${perPage}&page=${page}`);
    return data;
};

export const getJob = async (JobId) => {
    const { data } = await axiosInstance.get(`/jobs/${JobId}`);
    return data;
};
