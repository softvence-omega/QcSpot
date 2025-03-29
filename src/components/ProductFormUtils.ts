// src/utils/productFormUtils.ts
import { ChangeEvent, RefObject, Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

export const handleImageChange = (
  e: ChangeEvent<HTMLInputElement>,
  setPreview: (value: string | null) => void,
  ref: RefObject<HTMLInputElement | null>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file");
    if (ref.current) ref.current.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setPreview(reader.result as string);
  };
  reader.readAsDataURL(file);
};

export const handleMultipleImagesChange = (
  e: ChangeEvent<HTMLInputElement>,
  productImages: { file: File; preview: string }[],
  setProductImages: (images: { file: File; preview: string }[]) => void,
  productImagesRef: RefObject<HTMLInputElement | null>
) => {
  const files = e.target.files;
  if (!files) return;

  const newFiles = Array.from(files).filter((file) =>
    file.type.startsWith("image/")
  );

  if (newFiles.length !== files.length) {
    toast.error("Some files were not images and were not selected");
  }

  const remainingSlots = 10 - productImages.length;
  if (remainingSlots <= 0) {
    toast.error("You've reached the maximum of 10 images");
    return;
  }

  const filesToAdd = newFiles.slice(0, remainingSlots);
  if (filesToAdd.length < newFiles.length) {
    toast.error(
      `Only ${remainingSlots} more images can be added (max 10 total)`
    );
  }

  const newFilesWithPreviews = filesToAdd.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
  }));

  setProductImages([...productImages, ...newFilesWithPreviews]);

  if (productImagesRef.current) {
    productImagesRef.current.value = "";
  }
};

export const removeImage = (
  setPreview: (value: string | null) => void,
  ref: RefObject<HTMLInputElement | null>
) => {
  setPreview(null);
  if (ref.current) ref.current.value = "";
};

export const removeProductImage = (
  index: number,
  setProductImages: Dispatch<SetStateAction<{ file: File; preview: string }[]>>
) => {
  setProductImages((prev) => {
    URL.revokeObjectURL(prev[index].preview);
    return prev.filter((_, i) => i !== index);
  });
};

export const handleIncreaseInputField = (
  varient: { key: string; value: string }[],
  setVarient: (varient: { key: string; value: string }[]) => void
) => {
  setVarient([...varient, { key: "", value: "" }]);
};
