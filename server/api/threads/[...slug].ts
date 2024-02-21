import find from "./find";
import create from "./create";
import remove from "./delete";

const router = createRouter();

router.get("/find", find);
router.post("/create", create);
router.delete("/delete", remove);

export default useBase("/api/threads", router.handler);
