import { create } from "zustand";
import { axiosInstance } from "../api/axios";

interface PostStore {
  channels: { _id: string; name: string; description: string }[];
  channelId: string | null; // 선택된 채널 ID
  image: File | null;
  isLoading: boolean; // 로딩 상태
  error: string | null; // 에러 메시지
  setSelectedChannelId: (id: string) => void;
  fetchChannels: () => Promise<void>; // 채널 리스트 GET 요청
  setImage: (file: File | null) => void;
  post: (
    title: string,
    content: string,
    channelId: string,
    image?: File | null
  ) => Promise<boolean>; // POST 요청
}

export const usePostStore = create<PostStore>((set) => ({
  channels: [],
  channelId: null,
  isLoading: false,
  error: null,
  image: null,

  // 선택된 채널 ID 업데이트
  setSelectedChannelId: (id: string) => set({ channelId: id }),

  // 이미지 설정 함수
  setImage: (file: File | null) => set({ image: file }),

  // 채널 리스트 GET 요청
  fetchChannels: async () => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/channels`
      );

      if (response.data && response.data.length > 0) {
        set({ channels: response.data }); // 채널 리스트 저장
        set({ channelId: response.data[0]._id }); // 첫 번째 채널을 기본 선택
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      set({ error: "채널 리스트 가져오기 실패" });
    }
  },

  post: async (
    title: string,
    content: string,
    channelId: string,
    image?: File | null
  ) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", JSON.stringify({ title, content })); // 제목과 본문을 묶어서 title에 추가
      formData.append("channelId", channelId); // 선택된 채널 ID 추가
      if (image) {
        formData.append("image", image); // 이미지 파일 추가
      } else {
        formData.append("image", "null"); // 이미지가 없으면 null 값 추가
      }

      // axiosInstance 사용하기
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/posts/create`,
        formData
      );
      //성공
      console.log("Posting success:", response.data);
      //임시 여기 이쁘게 바꿔보기.
      alert("게시글이 포스팅 됐습니다");
      return true;
    } catch (error: any) {
      //에러코드에 따라 상태 처리
      if (error.response) {
        const { status } = error.response;
        switch (status) {
          case 400:
            set({ error: "잘못된 요청입니다. 입력값을 확인해주세요." });
            break;
          case 401:
            set({ error: "인증되지 않은 요청입니다. 다시 로그인해주세요." });
            break;
          case 403:
            set({ error: "권한이 없습니다. 관리자에게 문의하세요." });
            break;
          case 404:
            set({ error: "요청하신 페이지를 찾을 수 없습니다." });
            break;
          case 413:
            set({
              error: "서버에서 허용된 한도를 초과했습니다.",
            });
            break;
          case 500:
            set({
              error: "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            });
            break;
          default:
            set({
              error: `알 수 없는 오류가 발생했습니다. (Error Code: ${status})`,
            });
        }
      } else if (error.request) {
        // 요청은 전송되었으나 응답을 받지 못한 경우
        set({
          error: "서버로부터 응답을 받을 수 없습니다. 네트워크를 확인해주세요.",
        });
      } else {
        // 기타 에러
        set({ error: "요청 중 오류가 발생했습니다. 다시 시도해주세요." });
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
