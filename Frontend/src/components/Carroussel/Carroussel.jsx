import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styled from "styled-components";
import slide1 from "../../assets/images/nature1.jpeg";
import slide2 from "../../assets/images/nature2.jpg";
import slide3 from "../../assets/images/nautre 3.webp";
import slide4 from "../../assets/images/nature4.webp";


const slides = [slide1, slide2, slide3, slide4];

const CarouselWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: auto;

  .swiper {
    border-radius: 12px;
    overflow: hidden;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 100%;
    height: 520px;
    object-fit: cover;
    border-radius: 12px;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    background: rgba(0,0,0,0.35);
    padding: 15px;
    border-radius: 50%;
    transition: 0.2s;

    &:hover {
      background: rgba(0,0,0,0.55);
    }
  }

  .swiper-pagination-bullet {
    background: white;
    opacity: 0.7;
  }

  .swiper-pagination-bullet-active {
    background: #007aff;
    opacity: 1;
  }
`;

export default function CarouselPro() {
  return (
    <CarouselWrapper>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {slides.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`slide-${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </CarouselWrapper>
  );
}
