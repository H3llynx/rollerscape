import { describe, expect, it } from "vitest";
import { signIn, signUp } from "../services/auth";
import type { Credentials } from "../types";

describe("signUp", () => {
    const password = "t3st678";
    const email = "test@test.fr";
    it("should be declared", () => {
        expect(typeof signUp).toBe("function");
    });
    it("should return an object", async () => {
        expect(typeof await signUp({ email, password } as Credentials)).toBe("object");
    });
    it("should return an error object with an error code in case of sign up error", async () => {
        //test@test.fr is an existing user since the previous test :)
        const result = await signUp({ email, password } as Credentials)
        expect(result.error).toHaveProperty("code");
    })
})

describe("signIn", () => {
    const email = "test@test.fr";
    it("should be declared", () => {
        expect(typeof signUp).toBe("function");
    });
    it("should return an object", async () => {
        const password = "t3st678";
        expect(typeof await signIn({ email, password } as Credentials)).toBe("object");
    });
    it("should return an error object with an error code in case of sign in error", async () => {
        const password = "wrong-password"
        const result = await signIn({ email, password } as Credentials)
        expect(result.error).toHaveProperty("code");
    })
})