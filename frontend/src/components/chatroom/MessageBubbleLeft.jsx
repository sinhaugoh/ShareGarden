import { Image } from "react-bootstrap";
import { DEFAULT_PROFILE_PIC_PATH } from "../../constants";

export default function MessageBubbleLeft({ profile_image, content }) {
  return (
    <div className="my-3 d-flex align-items-center mw-80">
      <Image
        thumbnail
        roundedCircle
        src={profile_image ?? DEFAULT_PROFILE_PIC_PATH}
        className="me-2"
        style={{
          objectFit: "cover",
          height: "40px",
          aspectRatio: 1,
        }}
      />
      <div className="p-2 bg-lightgreen rounded ">
        <div>{content}</div>
      </div>
    </div>
  );
}
