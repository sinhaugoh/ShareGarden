import { Image } from "react-bootstrap";
import { DEFAULT_PROFILE_PIC_PATH } from "../../constants";

export default function MessageBubble({ profile_image, content }) {
  return (
    <div className="bg-primary my-3 d-flex ">
      <Image
        thumbnail
        roundedCircle
        src={profile_image ?? DEFAULT_PROFILE_PIC_PATH}
        className="me-4"
        style={{ objectFit: "cover", height: "40px", width: "40px" }}
      />
      <div>{content}</div>
    </div>
  );
}
