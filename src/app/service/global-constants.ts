// export const apiURL:string = "http://dev8.ivantechnology.in/gregorio_martinez/backend/admin/";
// export const baseURL:string = "http://dev8.ivantechnology.in/gregorio_martinez/backend/";
//export const apiURL:string = "http://192.168.20.117:8080/";
//export const apiURL:string = "https://dev8.ivantechnology.in/code_red_pizza/backend/api/v1/";
export const apiURL:string = "https://www.api.coderedpizza.com/api/v1/";

export const TABLE_LENGTH = 10;
export function showValidationMessage(result: any[]) {

  for (const key in result) {

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const element = result[key];
      if (element.message) {
        return element.message;
      }
    }
  }

  return "Validation Error: Please check all the fields correctly";
}

export function showServerErrorMessage(err: any) {
  if (err.status == 401) {
    return err.error.message;
  } else if (err.status == 404) {
    return err.message;
  } else {
    return "Please try again";
  }
}
export function resetPaginationOption() {
  return {
      hasNextPage: false,
      hasPrevPage: false,
      limit: TABLE_LENGTH,
      nextPage: null,
      page: 1,
      pagingCounter: 1,
      prevPage: null,
      totalDocs: 0,
      totalPages: 1,
  }
}

