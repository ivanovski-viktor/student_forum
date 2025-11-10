import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BlogPostMedia({ media }) {
  const audioFiles = media?.filter((file) => file.type.includes("audio"));

  return (
    media && (
      <>
        <div className="blog-slider">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            allowTouchMove={false}
          >
            {media.map((file, index) => {
              if (file.type.includes("video")) {
                return (
                  <SwiperSlide key={file.url} src={file.url}>
                    <video
                      className="blog-slider__media bg-black"
                      src={file.url}
                      controls={true}
                    >
                      Your browser does not support the video element.
                    </video>
                  </SwiperSlide>
                );
              } else if (file.type.includes("image")) {
                return (
                  <SwiperSlide key={file.url}>
                    <img
                      className="blog-slider__media"
                      src={file.url}
                      alt="Post media image"
                      loading="lazy"
                    />
                  </SwiperSlide>
                );
              }
            })}
          </Swiper>
        </div>
        <div className="mt-3">
          {audioFiles && (
            <>
              {audioFiles.length > 0 && (
                <h6 className="mb-2">Audio attachments: </h6>
              )}

              {audioFiles.map((file) => (
                <audio
                  key={file.url}
                  className="w-full"
                  src={file.url}
                  controls
                >
                  Your browser does not support the audio element.
                </audio>
              ))}
            </>
          )}
        </div>
      </>
    )
  );
}
