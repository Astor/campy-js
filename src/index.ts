import init, * as ecies from "ecies-wasm";

/**
 * Converts a Uint8Array to a hexadecimal string.
 * 
 * @param uint8Array - The Uint8Array to convert.
 * @returns A string representing the hexadecimal values of the input array.
 */
export function toHex(uint8Array: Uint8Array): string {
    return Array.from(uint8Array)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
}

/**
 * Converts a hexadecimal string to a Uint8Array.
 * 
 * @param hexString - The hexadecimal string to convert.
 * @returns A Uint8Array representing the bytes of the input hexadecimal string.
 */
export function fromHex(hexString: string): Uint8Array {
    const bytes: number[] = [];
    for (let i = 0; i < hexString.length; i += 2) {
      bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
}

/**
 * Encrypts a message using a given public key.
 * 
 * @param msg - The message string to be encrypted.
 * @param publicKey - The Uint8Array containing the public key used for encryption.
 * @returns A Promise that resolves to a string, which is the encrypted message represented as a hexadecimal string.
 */
export async function encryptMessage(msg:string, publicKey:Uint8Array):Promise<string> {
    try {
        await init();
        
        // TextEncoder to convert the message string to a Uint8Array
        const encoder = new TextEncoder();
        const encMsg = encoder.encode(msg);
        const encryptedMessage = ecies.encrypt(publicKey, encMsg);
        return toHex(encryptedMessage);
    } catch (error:any) {
        console.error(error);
        return 'ENCRYPTION_ERROR';
    }
}

/**
 * Decrypts an encrypted message using a secret key.
 * 
 * @param secretKeyArray - The Uint8Array containing the secret key used for decryption.
 * @param encryptedMessageHex - The encrypted message as a hexadecimal string that needs to be decrypted.
 * @returns A Promise that resolves to a string, which is the decrypted message.
 */
export async function decryptMessage(secretKeyArray:Uint8Array, encryptedMessageHex:string):Promise<string> {
    const encryptedMessage = fromHex(encryptedMessageHex);
    const decryptedMessage = ecies.decrypt(secretKeyArray, encryptedMessage);
    // TextDecoder to convert encrypted array to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedMessage);
}