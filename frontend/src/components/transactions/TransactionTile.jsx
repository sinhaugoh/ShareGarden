import { Card, Image, Button } from "react-bootstrap";
import { DEFAULT_PROFILE_PIC_PATH } from "../../constants";

export default function TransactionTile({
  id,
  requester,
  itemPostTitle,
  note,
  requestAmount,
  is_completed,
  handleButtonOnClick,
}) {
  return (
    <Card className="p-2 h-100">
      <div className="d-flex align-items-center mb-2">
        <Image
          roundedCircle
          thumbnail
          src={requester.profile_image ?? DEFAULT_PROFILE_PIC_PATH}
          height="70px"
          className="me-3"
          style={{ objectFit: "cover", height: "70px", width: "70px" }}
        />
        <div className="d-flex flex-column">
          <div className="fs-5 fw-semibold text-truncate">
            {requester.username}
          </div>
          <div className="text-truncate">
            {itemPostTitle} x {requestAmount}
          </div>
        </div>
      </div>
      {note && <div>Note:</div>}
      <div className="mb-3 text-truncate">{note}</div>
      {!is_completed && (
        <div className="d-grid gap-2 mt-auto">
          <Button variant="primary" onClick={() => handleButtonOnClick(id)}>
            Mark as completed
          </Button>
        </div>
      )}
    </Card>
  );
}
