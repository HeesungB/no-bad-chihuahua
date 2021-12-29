function trimLeadingNullBytes(inData: Uint8Array): Uint8Array {
  let numberOfLeadingNullBytes = 0;
  const convertInData = Array.from(inData);
  // eslint-disable-next-line no-restricted-syntax
  for (const byte of convertInData) {
    if (byte === 0x00) {
      numberOfLeadingNullBytes += 1;
    } else {
      break;
    }
  }
  return inData.slice(numberOfLeadingNullBytes);
}

export class Secp256k1Signature {
  public static fromDer(data: Uint8Array): { r: Uint8Array; s: Uint8Array } {
    let pos = 0;
    const derTagInteger = 0x02;
    // eslint-disable-next-line no-plusplus
    if (data[pos++] !== 0x30) {
      throw new Error('Prefix 0x30 expected');
    }
    // eslint-disable-next-line no-plusplus
    const bodyLength = data[pos++];
    if (data.length - pos !== bodyLength) {
      throw new Error('Data length mismatch detected');
    }

    // r
    // eslint-disable-next-line no-plusplus
    const rTag = data[pos++];
    if (rTag !== derTagInteger) {
      throw new Error('INTEGER tag expected');
    }

    // eslint-disable-next-line no-plusplus
    const rLength = data[pos++];
    if (rLength >= 0x80) {
      throw new Error('Decoding length values above 127 not supported');
    }
    const rData = data.slice(pos, pos + rLength);
    pos += rLength;

    // s
    // eslint-disable-next-line no-plusplus
    const sTag = data[pos++];
    if (sTag !== derTagInteger) {
      throw new Error('INTEGER tag expected 2');
    }
    // eslint-disable-next-line no-plusplus
    const sLength = data[pos++];
    if (sLength >= 0x80) {
      throw new Error('Decoding length values above 127 not supported 2');
    }
    const sData = data.slice(pos, pos + sLength);
    pos += sLength;

    return {
      r: trimLeadingNullBytes(rData),
      s: trimLeadingNullBytes(sData),
    };
  }
}
