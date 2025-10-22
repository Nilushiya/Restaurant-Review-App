package com.nilu.restaurant.exceptions;

public class PhotoNotFoundException extends BaseException{
    public PhotoNotFoundException() {
        super();
    }

    public PhotoNotFoundException(String message) {
        super(message);
    }

    public PhotoNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public PhotoNotFoundException(Throwable cause) {
        super(cause);
    }
}
