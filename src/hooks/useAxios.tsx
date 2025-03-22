import axios from "axios";

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://cnfans.com/open-api/v1/get_qc_photos?skupid=719471644340",
  headers: {
    Authorization: "Basic bWFzdGVyOnNlbzVAb0I0JGZUZjI4",
  },
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
