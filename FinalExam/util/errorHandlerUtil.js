class ErrorHandler {
    createErrorResponse(errorMsg, httpCode, type) {
        let output = {
            status: httpCode,
            message: this.clearMsg(errorMsg),
            type: type
        }

        return output;
    }

    clearMsg(msg) {
        console.log(msg);
        return msg.replaceAll('"', '');
    }
}

module.exports = new ErrorHandler();