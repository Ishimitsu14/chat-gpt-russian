import find from "./find";
import create from "./create";

const router = createRouter();

router.get("/find", find);
router.post("/create", create);

export default useBase("/api/messages", router.handler);
