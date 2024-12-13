import { create } from "zustand";
import { axiosInstance } from "../api/axios";

interface PostStore {
  post: (
    title: string,
    content: string,
    image: string | null,
    channelId: string
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  image: string | null;
  channelId: string;
}

export const usePostStore = create<PostStore>((set) => ({
  isLoading: false,
  error: null,
  image: null,
  channelId: "",
  post: async (title, content, image, channelId) => {
    set({ isLoading: true, error: null });
    try {
      //JSON 문자열로 변환해서 title로 넣기
      const combinedTitle = JSON.stringify({ title, content });
      //디버깅
      console.log("디버깅 체크", title, content, combinedTitle);

      //axiosInstance 사용하기
      const response = await axiosInstance
        .post(`${import.meta.env.VITE_API_URL}/posts/create`, {
          title: combinedTitle,
          image: JSON.stringify(null),
          channelId: "675aa3f8d3266e29a57e4c61",
        })
        .catch((err) => {
          console.error(err);
          throw new Error("POST 요청에 실패했습니다.");
        });

      //성공
      console.log("Post success!:", response.data);
      alert("Post submitted successfully!");
      //실패
    } catch (error: any) {
      console.error("Error posting data:", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));