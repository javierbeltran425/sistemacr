import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
    REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;