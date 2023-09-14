/** Add your frontend common function here */
import * as CryptoJS from "crypto-js";
import { PDFDocument } from "pdf-lib";
import { base64StringToBlob, createObjectURL } from "blob-util";

/** Check Duplicates in an array and return an array with no duplicates */
const checkDuplicates = (array) => {
  if (typeof array !== "object") {
    return "Should be an Array or Object";
  }
  const removeDuplicates = [
    ...new Set(array.map((e) => JSON.stringify(e))),
  ].map((e) => JSON.parse(e));
  return removeDuplicates;
};

/** Opens file in a New Window */
const openFileNewWindow = (fileData) => {
  let blob, blobUrl;
  if (typeof fileData !== "string") {
    throw new Error("Uploaded File is Not a String");
  }
  /* convert base64 string to blob object */
  blob = base64StringToBlob(
    fileData.substring(fileData.indexOf(",") + 1),
    "application/pdf"
  );
  /* convert blob to blobUrl */
  blobUrl = createObjectURL(blob);
  const win = window.open();
  win.document.write(
    '<iframe src="' +
      blobUrl +
      '" frameborder="0" style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;" allowfullscreen></iframe>'
  );
};

/** Checks whether a value exists in a array objects and return the object */
const keyMatchLoop = (key, data, value) => {
  if (Array.isArray(data) === false && data != null) {
    throw new Error("Data should be an array");
  } else if (typeof key !== "string" || key?.trim()?.length === 0) {
    throw new Error("Key should be a string type and cannot be empty");
  } else if (typeof value !== "string") {
    throw new Error("Value should be a string");
  } else {
    for (let i = 0; i < data?.length; i++) {
      if (data[i][key] === value) {
        return data[i];
      }
    }
    return "";
  }
};

/**
 * Function for reading files and returning them as base64 string
 * @param {Object} fileReaderObject - Object parameters for fileReader
 * @param {Object} fileReaderObject.errorMessage - Object paramters for error messages
 * @param {String} fileReaderObject.errorMessage.NoFileError - Error Message for no File
 * @param {String} fileReaderObject.errorMessage.fileTypeErr - Error Message for file Type mismatch
 * @param {String} fileReaderObject.errorMessage.fileSizeErr - Error Message if file size exceeds than the provided one
 * @param {Object} fileReaderObject.fileEvent - File Event from input event callback
 * @param {String} fileReaderObject.fileType - Type of File that should be accepted.
 * @param {Number} fileReaderObject.fileSize - Maximum file Size in bytes.
 * @param {String} [fileReaderObject.fileRead = "readAsArrayBuffer"] - Type of File Reader we can use. Default is readAsArrayBuffer
 * @param {String} [fileReaderObject.noLimit = false] - Limit on filesize, if true will not consider fileSize. Default is false
 * @returns {Promise} Promise object which File Object with name, data, size and type. If multiple files uploaded array of file Objects will be returned.
 * @example
 * fileReaderFunction({
 * 	fileEvent:event,
 * 	fileType:"pdf",
 * 	fileSize:100000,
 * 	errorMessage:{
		* NoFileError:"Please Upload File"
		fileTypeErr:"PDF only"
		fileSizeErr:"Size Exceeds more than 10 MB"}
	})
 */

const fileReaderFunction = async ({
  fileEvent,
  fileType,
  fileSize,
  errorMessage,
  fileRead = "readAsArrayBuffer",
  noLimit = false,
}) => {
  let fileDataArray;
  const file = fileEvent.target.files;
  const fileLength = fileEvent.target.files.length;
  if (!fileType || (!fileSize && noLimit === false) || !errorMessage) {
    throw new Error("Some arguments are missing");
  } else if (typeof fileType !== "string") {
    throw new Error("fileType should be a String");
  } else if (typeof fileSize !== "number" && noLimit === false) {
    throw new Error("fileSize should be a Number");
  } else if (typeof errorMessage !== "object") {
    throw new Error("errorMessage should be an Object");
  } else if (
    !errorMessage.NoFileError ||
    !errorMessage.fileTypeErr ||
    !errorMessage.fileSizeErr
  ) {
    throw new Error("Some Keys of errorMessage Object is missing");
  } else if (!file) {
    throw new Error(errorMessage.NoFileError);
  }

  function readFile(file) {
    const fileObject = {};
    const reader = new FileReader();
    if (!file.type.includes(fileType)) {
      throw new Error(errorMessage.fileTypeErr);
    } else if (file.size > fileSize && noLimit === false) {
      throw new Error(errorMessage.fileSizeErr);
    }
    const promiseFileFunction = new Promise((_resolve) => {
      reader.onload = async () => {
        const existingPdfBytes = new Uint8Array(reader.result);
        // Creating new empty pdf
        const pdfDoc = await PDFDocument.create();
        // Copy all pages from the existing PDF to the new PDF
        const existingPdf = await PDFDocument.load(existingPdfBytes);
        const pages = await pdfDoc.copyPages(
          existingPdf,
          existingPdf.getPageIndices()
        );
        pages.forEach((page) => {
          pdfDoc.addPage(page);
        });

        // Remove metadata properties from the new PDF
        pdfDoc.setTitle("");
        pdfDoc.setAuthor("");
        pdfDoc.setSubject("");
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer("");
        pdfDoc.setCreator("");

        const base64String = await pdfDoc.saveAsBase64({
          dataUri: true,
        });
        fileObject.fileData = base64String;
        fileObject.fileName = file.name;
        fileObject.fileSize = file.size;
        fileObject.fileType = file.type;
        _resolve(fileObject);
      };
      reader.readAsArrayBuffer(file);
    });
    return promiseFileFunction;
  }

  // eslint-disable-next-line no-useless-catch
  try {
    fileDataArray = Array.from(file).map((singleFile) =>
      readFile(singleFile, fileRead)
    );
  } catch (error) {
    throw error;
  }

  const returnData = await Promise.all(fileDataArray);

  if (fileLength === 1) {
    return returnData[0];
  } else {
    let size = returnData
      .map((file) => file.fileSize)
      .reduce((prev, curr) => prev + curr, 0);
    if (size > fileSize && noLimit === false) {
      throw new Error(errorMessage.fileSizeErr);
    }
    return returnData;
  }
};
/**
 * Function for fetching Data
 * @param {Object} fetchObject - Object paramters for fetch function
 * @param {String} fetchObject.url - URL for fetching data
 * @param {String} [fetchObject.method = 'GET'] - Method for fetching data. Default is GET
 * @param {Object} [fetchObject.headers = {}] - Headers configuration for fetching data.
 * @param {Object} [fetchObject.isAuthRequired = false] - Require Auth Token or not. Default is false
 * @param {Object} [fetchObject.isEncrypted = false] - Require Decryption or not. Default is false
 * @param {Object} [fetchObject.isEncryptedPayload = true] - Require Encryption or not. Default is true
 * @param {Object} data - Data that can be used for POST call. Method should be POST if data is provided
 * @returns {Promise} Promise object which contains result of boolean type and data which can be error or result data of API.
 * @example
 * //For GET
 * fetchData({url:sampleUrl.com})
 * //For Others
 * fetchData({url:sampleUrl.com,method:'POST',headers:{AUTH:AUTH}},[data:{}])
 */
const fetchData = async (
  {
    url,
    method = "GET",
    headers = {},
    isAuthRequired = false,
    isEncrypted = false,
    isEncryptedPayload = false,
  } = {},
  data
) => {
  if (typeof url !== "string") {
    throw new Error("URL is not in string");
  }
  if (typeof isAuthRequired !== "boolean") {
    throw new Error("isAuth is not a boolean");
  }
  headers["Content-Type"] = "application/json";
  if (isAuthRequired === true) {
    headers.Authorization = `Bearer ${localStorage.getItem("allMasterToken")}`;
  }
  const fetchObject = {
    method,
    headers,
    // credentials: "include",
  };
  if (method === "POST") {
    if (data === null || data === undefined) {
      throw new Error("Data is not given for a post call");
    } else {
      if (isEncryptedPayload) {
        const encryptedPayload = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          import.meta.env.VITE_ENCRYPTION_KEY
        ).toString();
        fetchObject.body = JSON.stringify({ data: [encryptedPayload] });
      } else {
        fetchObject.body = JSON.stringify(data);
      }
    }
  }
  try {
    const response = await fetch(url, fetchObject);
    const status = response.status;
    
    if (status === 200) {
      const responseData = await response.json();
      if (responseData.status === 1) {
        if (
          isEncrypted === true &&
          Object.prototype.hasOwnProperty.call(responseData, "data")
        ) {
          const decryptBytes = CryptoJS.AES.decrypt(
            responseData.data,
            import.meta.env.VITE_ENCRYPTION_KEY
          );
          const decryptUTF = decryptBytes.toString(CryptoJS.enc.Utf8);
          return JSON.parse(decryptUTF);
        } else {
          return Object.prototype.hasOwnProperty.call(responseData, "data")
            ? JSON.parse(responseData.data)
            : responseData.response;
        }
      } else {
        throw new Error(responseData.response);
      }
    }
    if (status === 401) {
      localStorage.clear();
      window.location.replace("/login");
      throw new Error("Unauthorized Access");
    } else {
      throw new Error("Requests limit exceeds. Wait for few seconds");
    }
  } catch (error) {
    throw new Error(error);
  }
};

/** Trims the unwanted space from string */
const trimString = (string) => {
  if (typeof string !== "string") {
    return "DataType should be a string";
  }
  return string.trim();
};

/** Combines all arrays and nested arrays into a single array */
const combineArray = (...args) => {
  const array = [...args];
  if (array.length <= 1) {
    return "Send more than an array";
  }
  return [...args].flat();
};

/**
 * Removes all the spaces in string
 * @param {string} string String to remove all the spaces
 * @returns {string} String
 */
const removeSpacesInString = (string) => {
  if (typeof string !== "string") {
    return "Given parameter is not a string";
  }
  return string.replace(/\s/g, "");
};

/** Remove space and return them in lowercase */
const convertLowerRemoveSpacesInString = (string) => {
  if (typeof string !== "string") {
    return "Given parameter is not a string";
  }
  return string.toLocaleLowerCase().replace(/\s/g, "");
};

const inputLengthRestriction = (event, length) => {
  const maxLength = length;
  const value = event.target.value;
  if (value.length > maxLength) {
    event.target.value = value.slice(0, maxLength);
  }
};

/** Returns a string with first letter as Uppercase */
const convertFirstLettersAsUpperCase = (value) => {
  if (typeof value !== "string") {
    throw new Error("Value is not a string type");
  }
  return value
    .split(" ")
    .map((string) =>
      string
        .substring(0, 1)
        .toUpperCase()
        .concat(string.substring(1, string.length))
    )
    .join(" ");
};

/** calcuting current price origin, fright, destination , total cbm booked  for specific scdehule */

/** parameter required entire booking array and specific schedule object */

/** It will return object consists of current price origin, fright, destination , total cbm booked along with entire schedule data */

const calculateCurrentPriceBySchedule = (bookingList, schedule) => {
  let originCurrentPrice = schedule.finalRates.FOCFS;
  let frightCurrentPrice = schedule.finalRates.FF;
  let destinationCurrentPrice = schedule.finalRates.FDCFS;
  let originCurrentOCFS = schedule.finalRates.FOCFS;
  let destinationCurrentCFS = schedule.finalRates.FDCFS;
  let totalCbmBooked = 0;
  let preBookingCbmBooked = 0;
  let preBookingCount = 0;

  for (let index = 0; index < bookingList.length; index++) {
    const booking = bookingList[index];
    if (booking.scheduleId === schedule._id) {
      if (booking.status === 1 || booking.status === 9) {
        totalCbmBooked = Number(totalCbmBooked) + Number(booking.totalCbm);
        totalCbmBooked = Number(totalCbmBooked).toFixed(1);
      }
      if (booking.status === 2) {
        preBookingCount += 1;
        preBookingCbmBooked =
          Number(preBookingCbmBooked) + Number(booking.totalCbm);
        preBookingCbmBooked = Number.isInteger(preBookingCbmBooked)
          ? preBookingCbmBooked
          : preBookingCbmBooked.toFixed(1);
      }
    }
  }
  if (schedule.finalRates.FOCFS === schedule.finalRates.USDMROCFS) {
    if (totalCbmBooked > schedule.originBE.OMBECBM) {
      originCurrentPrice = Math.round(
        schedule.finalRates.USDOCFS / totalCbmBooked
      );
      originCurrentOCFS = Math.round(
        schedule.finalRates.USDOCFS / totalCbmBooked
      );
    }
  } else {
    if (totalCbmBooked > schedule.originBE.OGBECBM) {
      originCurrentPrice = Math.round(
        schedule.finalRates.USDOCFS / totalCbmBooked
      );
      originCurrentOCFS = Math.round(
        schedule.finalRates.USDOCFS / totalCbmBooked
      );
    }
  }

  if (schedule.finalRates.FDCFS === schedule.finalRates.USDMRDCFS) {
    if (totalCbmBooked > schedule.destinationBE.DMBECBM) {
      destinationCurrentPrice = Math.round(
        schedule.finalRates.USDDCFS / totalCbmBooked
      );
      destinationCurrentCFS = Math.round(
        schedule.finalRates.USDDCFS / totalCbmBooked
      );
    }
  } else {
    if (totalCbmBooked > schedule.destinationBE.DGBECBM) {
      destinationCurrentPrice = Math.round(
        schedule.finalRates.USDDCFS / totalCbmBooked
      );
      destinationCurrentCFS = Math.round(
        schedule.finalRates.USDDCFS / totalCbmBooked
      );
    }
  }

  if (schedule.finalRates.FF === schedule.freightComparison.MRF) {
    if (totalCbmBooked > schedule.freightBE.FMBECBM) {
      frightCurrentPrice = Math.round(schedule.freightCost.F / totalCbmBooked);
    }
  } else {
    if (totalCbmBooked > schedule.freightBE.FGBECBM) {
      frightCurrentPrice = Math.round(schedule.freightCost.F / totalCbmBooked);
    }
  }
  return {
    ...schedule,
    originCurrentPrice,
    originCurrentOCFS,
    frightCurrentPrice,
    destinationCurrentPrice,
    destinationCurrentCFS,
    totalCbmBooked,
    preBookingCbmBooked,
    preBookingCount,
  };
};

/** calcuting total cbm booked  for specific scdehule */

/** parameter required entire booking array and specific schedule object */

/** It will return object consists of  total cbm booked along with entire schedule data */

const calculateTotalCbmBookedBySchedule = (bookingList, schedule) => {
  let totalCbmBooked = 0;
  bookingList.map((booking) => {
    if (booking.scheduleId === schedule._id) {
      if (booking.status === 1) {
        totalCbmBooked = Math.round(totalCbmBooked + Number(booking.totalCbm));
      }
    }
    return 0;
  });
  return {
    ...schedule,
    totalCbmBooked,
  };
};

const removeDuplicates = (array, key) => {
  return array.reduce((arr, item) => {
    const filtered = arr.filter((value) => value[key] !== item[key]);
    return [...filtered, item];
  }, []);
};

/**
 * Function to convert other metrics to cm
 * @param {Number} value Number that needs to converted to cm
 * @param {String} metric Metric unit
 * @returns {Number}
 */
function convertIntoCm(value, metric) {
  switch (metric) {
    case "M":
      return formatNumber(value * 100);
    case "IN":
      return formatNumber(value * 2.54);
    case "CM":
      return formatNumber(value);
    case "MM":
      return formatNumber(value / 10);
    default:
      return 0;
  }
}

/**
 * Function to round to decimals
 * @param {number} number
 * @returns {number} Number with fixed decimals
 */
const roundToDecimal = (number) => {
  if (Number.isInteger(number)) {
    return number === 0 ? "" : number;
  } else {
    return number.toFixed(1);
  }
};

function formatNumber(input) {
  const numericValue = parseFloat(input);
  if (!isNaN(numericValue)) {
    if (Number.isInteger(numericValue)) {
      return numericValue;
    } else {
      return numericValue.toFixed(1);
    }
  }
}

export {
  checkDuplicates,
  removeSpacesInString,
  openFileNewWindow,
  keyMatchLoop,
  fileReaderFunction,
  fetchData,
  trimString,
  convertFirstLettersAsUpperCase,
  combineArray,
  convertLowerRemoveSpacesInString,
  inputLengthRestriction,
  calculateCurrentPriceBySchedule,
  calculateTotalCbmBookedBySchedule,
  removeDuplicates,
  convertIntoCm,
  roundToDecimal,
  formatNumber,
};
