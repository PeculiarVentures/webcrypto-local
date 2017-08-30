## HOW TO ADD A NEW TOKEN

Every smart card or token has a ATR, this can be used to identify the token.

In OSX you can see this value by running `pcsctest` which will return something like this:

```
bash-3.2# pcsctest

MUSCLE PC/SC Lite Test Program

Testing SCardEstablishContext    : Command successful.
Testing SCardGetStatusChange 
Please insert a working reader   : Command successful.
Testing SCardListReaders         : Command successful.
Reader 01: SafeNet eToken 5100
Enter the reader number          : 01
Waiting for card insertion         
                                 : Command successful.
Testing SCardConnect             : Command successful.
Testing SCardStatus              : Command successful.
Current Reader Name              : SafeNet eToken 5100
Current Reader State             : 0x54
Current Reader Protocol          : 0x1
Current Reader ATR Size          : 14 (0xe)
Current Reader ATR Value         : 3B D5 18 00 81 31 FE 7D 80 73 C8 21 10 F4 
Testing SCardDisconnect          : Command successful.
Testing SCardReleaseContext      : Command successful.
Testing SCardEstablishContext    : Command successful.
Testing SCardGetStatusChange 
Please insert a working reader   : Command successful.
Testing SCardListReaders         : Command successful.

```

Alternativly you can use `opensc-tool` to get the ATR:

```
opensc-tool --reader 0 --atr
```

Here you see the `Current Reader ATR Value` and the `Current Reader Name`, for 'token' form-factor devices this is all we need to update the card.json so webcrypto-local knows which driver to load for which card. For card form-factor devices we will need to [look up the name of the device](https://smartcard-atr.appspot.com). 

This is a link to a [Pull Request that added support for the above device](https://github.com/PeculiarVentures/webcrypto-local/commit/02e272b8e3efa64b96de8c841884dd97d55960b4).

We basically do the following in this PR:
- Add a definition for the given ATR
- Ensure the reference driver knows where to find the PKCS#11 library on each platform
  
 With these changes now webcrypto-local knows which PKCS#11 to load for this device.
 
 So for this device we would need a card.json that included something like:
 
 ```
 {
	"cards": [{
		"atr": "3BD518008131FE7D8073C82110F4",
		"name": "SafeNet eToken 5100",
		"driver": "39b3d7a3662c4b48bb120d008dd18648"
	}],
	"drivers": [{
		"id": "39b3d7a3662c4b48bb120d008dd18648",
		"name": "SafeNET",
		"file": {
			"windows": "/Windows/System32/eTPKCS11.dll",
			"osx": "/usr/local/lib/libeTPkcs11.dylib"
		}
	}]
}
```
