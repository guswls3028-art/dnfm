/**
 * upload.js (newb) — R2 presigned PUT 흐름. hurock 패턴 미러.
 *
 *   const { r2Key } = await uploadFile(file, { purpose: "post_attachment" });
 *
 * 1) backend /uploads/presigned-put → { uploadId, putUrl, r2Key }
 * 2) putUrl PUT (Content-Type 일치)
 * 3) backend /uploads/:id/confirm → status pending → ready
 * 4) r2Key 반환
 *
 * 표시: backend `/uploads/r2/<key>` 가 presigned GET 으로 302 redirect.
 */

import { ApiError, uploads } from "@/lib/api-client";

const UPLOAD_PURPOSES = ["avatar", "dnf_capture", "contest_entry", "post_attachment"];

export async function uploadFile(file, { purpose }) {
  if (!file) throw new Error("파일이 비어 있습니다");
  if (!UPLOAD_PURPOSES.includes(purpose)) {
    throw new Error(`unknown upload purpose: ${purpose}`);
  }

  const presign = await uploads.presignedPut({
    purpose,
    contentType: file.type || "application/octet-stream",
    sizeBytes: file.size,
  });

  const { uploadId, putUrl, r2Key } = presign || {};
  if (!putUrl || !uploadId || !r2Key) {
    throw new ApiError({
      status: 0,
      code: "presign_response_invalid",
      message: "presigned PUT 응답 형식이 비정상입니다.",
      raw: presign,
    });
  }

  const res = await fetch(putUrl, {
    method: "PUT",
    headers: { "content-type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) {
    throw new ApiError({
      status: res.status,
      code: "r2_put_failed",
      message: `R2 업로드 실패 (HTTP ${res.status})`,
    });
  }

  try {
    await uploads.confirm(uploadId, { sizeBytes: file.size });
  } catch (err) {
    if (typeof console !== "undefined" && console.warn) {
      console.warn("upload confirm failed", err);
    }
  }

  return { uploadId, r2Key };
}
