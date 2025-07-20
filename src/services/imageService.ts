import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (
  file: File,
  folderName: string = "images"
) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${folderName}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
