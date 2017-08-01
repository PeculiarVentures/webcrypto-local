To debug an issue there are a few different pieces of information that are useful, these include:

- The error you are seeing?    
- The log file from webcrypto-local?

    ```
    cat ~/.fortify/LOG.log
    ```
    
- The log file from PVPKCS11?

    ```
    cat /tmp/PVPKCS11.log
    ```
    
- What make and model smart card you have?

    ```
    pcsctest
    ```
    
- What keys are on your smart card?

    ```
    pkcs15-tool --list-keys
    ```
    
- What certificates are on your smart card?

    ```
    pkcs15-tool --list-certificates
    ```
    
While not every issue will need the same information these are probably useful details to consider including in any bug you may file.
