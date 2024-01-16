import { HashComparer } from "@motivation/application/cryptography/hash-comparer";
import { HashGenerator } from "@motivation/application/cryptography/hash-generator";

export class FakerCryptography implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return Promise.resolve(plain.concat("-hashed"));
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const result = await this.hash(plain);

    return Promise.resolve(result === hash);
  }
}
