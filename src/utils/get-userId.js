export const getUserId = () => {
    if (typeof window === "undefined") {
      return null;
    }
  
    const profileData = localStorage.getItem("userData");
    if(profileData === "undefined") return null
    return JSON.parse(profileData)?.userData?.userId
  };    