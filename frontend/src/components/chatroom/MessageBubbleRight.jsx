import { Image } from "react-bootstrap";
import { DEFAULT_PROFILE_PIC_PATH } from "../../constants";

export default function MessageBubbleRight({ profile_image, content }) {
  return (
    <div className="my-3 d-flex align-items-center ms-auto mw-80">
      <div className="p-2 bg-lightgreen rounded">
        <div>{content}</div>
      </div>
      <Image
        thumbnail
        roundedCircle
        src={profile_image ?? DEFAULT_PROFILE_PIC_PATH}
        className="ms-2"
        style={{ objectFit: "cover", height: "40px", aspectRatio: 1 }}
      />
    </div>
  );
}
