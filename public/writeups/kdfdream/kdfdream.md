## Kdfdream Writeup
Challenge Author: KILLERDOG  
Challenge difficulty: Medium  
Challenge Files: [here](https://morrisbe.de/challenge_files/kdf-dream.zip)  
Challenge description:   
```
We've managed to insert ourselves into a secure channel between two covert agents, however we overplayed our hand and they have become suspicious that their channel is compromised.

Realising that there is no way to restablish trust over the compromised network, Alice called for them to carry out a NIST Certified KDF protocol to generate a symmetric OTP, and then for them to use this to encrypt a physical message at a dead drop location.

We want to control the message she leaves, can you influence their conversation to control what Bob reads at the dead drop?
```
### Table of Contents 

### Summary
In this challenge, Alice and Bob use a [Diffie-Hellman key-exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) and message authentication to attempt to exchange a message securely. If this message includes "allgoodprintflag", the flag is printed. Importantly, we are a powerful Man-in-the-Middle (MITM) between Alice and Bob and can manipulate the DH parameters, the choice of authentication protocol, and the nonces exchanged by Alice and Bob as ephemeral key material.

We first use our powerful MITM capabilities to ensure we know Alice's and Bob's shared key by passing P-1 as their public keys. Then, [NIST SP 800-108 Rev 1](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-108r1-upd1.pdf) dunks the rest of the solution on us: 
- When [CMAC](https://cryptography.io/en/latest/hazmat/primitives/mac/cmac/) is chosen by Alice and Bob, as long as we control about 16 bytes of the input, we can control the output.
We use this to manipulate the OTP to lead to "allgoodprintflag".

Implementing this vulnerability has a twist, though: 
- A $2^{16}$ brute-force is required as our AES-CMAC blocks aren't perfectly aligned
### Overview
Let's walk through the execution of the Python script, conceding our MITM capabilities and simply forwarding all messages:
```
you have intercepted Bob sending the following message to Alice
context: DH
msg: 41[...]52
what would you like Alice to receive? 

you have intercepted Alice sending the following message to Bob
context: DH
msg: 86[...]68
what would you like Bob to receive?

you have intercepted Bob sending the following message to Alice
context: protocol
msg: HMAC/CMAC/KMAC 
what would you like Alice to receive? # defaults to HMAC

you have intercepted Alice sending the following message to Bob
context: protocol
msg: HMAC/CMAC/KMAC
what would you like Bob to receive?

you have intercepted Bob sending the following message to Alice
context: KDF nonce
msg: 3659554d1556857cfdbd53ec2474814e
what would you like Alice to receive?

you have intercepted Alice sending the following message to Bob
context: KDF nonce
msg: ae40d55b96e75404646a9196f14a16a1
what would you like Bob to receive?

Alice has made the bag drop, waiting for Bob to pick up and decode the message
Bob received alice's warning and disappears into the night with the flag
```
First, Alice and Bob complete a typical DH key exchange. As always, though, DH does not include message authentication. Therefore, Alice and Bob create an ephemeral secret by exchanging 16-byte nonces that they calculate. These nonces, combined with their previously exchanged shared keys, are then used to create equal [one-time-pads](https://en.wikipedia.org/wiki/One-time_pad) used to exchange the final message through xor.

As seen, we have some very powerful MITM capabilities. We can influence all message exchanges besides the final bagdrop where the OTPs are used to send and retrieve the message.
### Breaking the DH Key-Exchange

Before exploring more of the challenge, let's first break the DH key exchange so we have something to work with:

The DH public key (PK) calculation for Alice works as follows (Same principle for Bob):
$$
\text{PK\_Alice} = G^{\text{alice\_x}} \mod P
$$
Where $alice\_x$ is a random number between `2` and `P-1`. 

The shared secret is then calculated through:
$$
\text{Shared\_Secret} = \text{PK\_Bob}^{alice\_x} \bmod P
$$
Since our MITM capabilities allow us to control PK_Bob, we choose $\text{PK\_Bob} = P-1$ which leads to the following equation and simplification:
$$
\text{Shared\_Secret} = (P-1)^{\text{alice\_x}} \bmod P
$$
Since $P-1 \equiv -1 \pmod{P}$, we get:
$$
\text{Shared\_Secret} = (-1)^{\text{alice\_x}} \bmod P
$$
- If $\text{alice\_x}$ is even, $\text{Shared\_Secret} = 1$.
- If $\text{alice\_x}$ is odd, $\text{Shared\_Secret} = P - 1$.

So let's use this and always pass $P-1$ as $alice\_x$ and $bob\_x$. 

We must not forget to complete the following obfuscation to receive the actual `shared_key`:
```
shared_key = SHA256.new(shared_secret).digest()[:16]
```
So we choose either $1$ or $P-1$ as the shared secret and compute the `shared_key` like above.

Since the chance of the $\text{Shared\_Secret}$ that Alice and Bob calculate being $1$ is $50\%$, and that by Bob is also $50\%$, we have a $25\%$ chance that the above calculated value is the correct `shared_key` for both parties. This is a very quick and dirty solution; there are more effective techniques for DH MITM. For instance, we could pass our own public values to Alice and Bob and use them to decrypt and re-encrypt messages between Alice and Bob as described [here](https://www.geeksforgeeks.org/man-in-the-middle-attack-in-diffie-hellman-key-exchange/).
### CMAC NIST Vulnerability
The challenge's code refers us to NIST SP-800-108 in line 87:
```
# NIST SP 800-108, Recommendation for Key Derivation Using Pseudorandom Functions
```
Before even looking at the official document, googling "NIST SP 800-108 Vulnerability" leads to the top result: [a blog by Scott Arciszewski](https://scottarc.blog/2024/06/04/attacking-nist-sp-800-108/). The blog explains that when we use CMAC as message authentication, if we have control of more than 16 bytes of the CMAC input, we can arbitrarily control the outputs. 

Using our powerful MITM capabilities, we have the ability to control the nonces exchanged by Alice and Bob. These nonces are exactly 16 bytes long and are parts of the CMAC inputs for the OTP! To ensure we don't manipulate too much and have all the information we need, we allow Bob to send his nonce to Alice, observe the nonce that Bob would receive, and choose the 16-byte nonce that Bob actually receives based on the vulnerability.
#### CMAC Counter-Mode
CMAC Counter Mode takes and calculates the following inputs to provide a single OTP:
```
---------------- TAKEN INPUTS ----------------
shared_key = ...
context = alice_ctx1 + alice_ctx2 # without MITM same for Bob
output_length = 16
label = "keygen_for_secure_bagdrop"

---------- Calculated Intermediates ----------
# Two sub-keys derived from share_key
K1 = ...
K2 = ...

# Inputs concatenated and split into M[i]
info = long_to_bytes(1, 4) + label + b'\x00' + context + long_to_bytes(128, 4)
M1 = info[:16]
M2 = info[16:32]
M3 = info[32:48]
M4 = info[48:64]
M5 = info[64:66]

------------------- Result -------------------
assert OTP == 3e21e02dba92a43450a0cea3f647d07c
```

*Note: The sub-keys are required for the final block. When the block is incomplete, K2 is used.*

To calculate the subkeys, we just copy the [pycryptodome implementation](https://github.com/Legrandin/pycryptodome/blob/master/lib/Crypto/Hash/CMAC.py) for CMAC, inputting the `shared_key` and receiving the two subkeys `K1` and `K2`. 

We now use the determined `M[i]` together with the shared key in rounds until each `M[i]` is processed, and we reach the final output.
```
encrypt = AES.new(master, AES.MODE_ECB).encrypt

C1 = encrypt(M1)
C2 = encrypt(xor(C1, M2))
C3 = encrypt(xor(C2, M3))
C4 = encrypt(xor(C3, M4))
C5 = encrypt(xor(C4, xor(M5, K2)))
```
Where `C5` is the output OTP.

#### Reversing CMAC Counter-Mode
For a formal description of the vulnerability, we look to the official [NIST SP 800-108 Rev. 1 document](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-108r1-upd1.pdf). In the appendix, the key realization described is that the AES-CMAC operations are reversible. If we have a **desired final output**, we can reverse the operations to determine what our controlled block must equal.

We reverse the last AES-CMAC step as follows to get C4:
```
decrypt = AES.new(master, AES.MODE_ECB).encrypt
C4 =  xor(xor(decrypt(C5), M5), K2)
```
To reverse an intermediate AES-CMAC step, we do:
```
decrypt = AES.new(master, AES.MODE_ECB).decrypt
C1 =  xor(decrypt(C2), M2)
```

Say `M3` was completely under our control, and we have a desired `C5` 
- We follow the typical behavior of AES-CMAC from above as far as we can with known variables. 
- We reverse the behavior of AES-CMAC starting from `C5` as far as we can 
- We rearrange `xor(decrypt(C3), M3)` for M3 which is the only unknown:
```
encrypt = AES.new(master, AES.MODE_ECB).encrypt
decrypt = AES.new(master, AES.MODE_ECB).decrypt

C1 = encrypt(M1)
C2 = encrypt(xor(C1, M2))

C4 =  xor(xor(decrypt(C5), M5), K2)
C3 =  xor(decrypt(C4), M4)

# C2 = xor(decrypt(C3), M3) rearranged
M3 = xor(decrypt(C3), C2)
```
If we use this determined `M3` in CMAC Counter-Mode, we obtain `C5`. 
#### Desired Output
What is our desired output though? We can calculate Alice's OTP since we have both nonces. Using this OTP, we know the exact OTP for Bob that would lead to "success":
```
---------------- Bagdrop from challenge ----------------
alice_msg = b'wearecompromised'
success = b'allgoodprintflag'
bagdrop = xor(alice_msg, alice_OTP)

---------------- required output ----------------
needed_t = xor(bagdrop, success)

assert success == xor(needed_t, bagdrop)
```
#### Controlling Only 14 Bytes of M3
We have a minor issue though in our above exploit: We control 16 bytes, but only control 14 bytes of `M[3]` and the last 2 bytes of `M[2]`. This is due to the way the `M[i]` blocks were extracted from the initial concatenation. This is pretty simple to fix, we just brute force through all $2^{16}$ combinations of the last 2 bytes of `M[2]` we control, and recalculate `M[3]` until the last two bytes of non-controlled part of the `M[3]` block matches our recalculated `M[3]`.
### Full Solve Script
The challenge was hosted remotely to obtain the flag. This version uses the script `chall.py`, which must be in the same directory:
```
from pwn import remote, process
from Crypto.Protocol.KDF import SP800_108_Counter
from primitives import HMAC_PRF, CMAC_PRF, KMAC_PRF, SHA256
import random
from Crypto.Util.number import size as bit_size, long_to_bytes, bytes_to_long
from Crypto.Hash import CMAC, HMAC, KMAC128, SHA256
from Crypto.Cipher import AES
from Crypto.Util.strxor import strxor

def xor(a, b):
    assert len(a) == len(b)
    return bytes([x^y for x,y in zip(a,b)])

def derive_key(secret: int) -> bytes:
    secret_str = str(secret).encode()
    return SHA256.new(secret_str).digest()[:16]

def SP800_108_Counter_reverse(master, key_len, wanted, label, alice_ctx2):
    key_len_enc = long_to_bytes(128, 4)
    # subkey generation from pycryptodome
    def generate_cmac_subkeys(key: bytes):
        def _shift_bytes(bs, xor_lsb=0):
            num = (bytes_to_long(bs)<<1) ^ xor_lsb
            return long_to_bytes(num, len(bs))[-len(bs):]
        const_Rb = 0x87
        cipher = AES.new(key, AES.MODE_ECB)
        l = cipher.encrypt( bytes([0])*AES.block_size)
        if l[0] & 0x80:
            k1 = _shift_bytes(l, const_Rb)
        else:
            k1 = _shift_bytes(l)
        if k1[0] & 0x80:
            k2 = _shift_bytes(k1, const_Rb)
        else:
            k2 = _shift_bytes(k1)
        return k1, k2

    key_len_enc = long_to_bytes(16 * 8, 4)
    our_nonce = b'\x00'*16
    info = long_to_bytes(1, 4) + label + b'\x00' + our_nonce + alice_ctx2 + key_len_enc
    M1 = info[:16]
    M2 = info[16:32]
    M3 = info[32:48]
    M4 = info[48:64]
    M5 = info[64:66]

    K1, K2 = generate_cmac_subkeys(master)
    cipher = AES.new(master, AES.MODE_ECB)
    encrypt = cipher.encrypt
    decrypt = cipher.decrypt 

    for i in range(2**16):
        C1 = cipher.encrypt(M1)
        binary_str = i.to_bytes(2, byteorder='big')
        M2 = info[16:30] + binary_str
        C2 = encrypt(xor(C1, M2))
        
        C5 = last_block = strxor(M5+bytes([128])+ bytes([0])*(14-1), K2)
        C4 = xor(decrypt(wanted), C5)
        C3 = xor(decrypt(C4), M4)

        needed_M3 = xor(C2, decrypt(C3))
        if needed_M3[14:] != info[46:48]:
            continue
        return binary_str + needed_M3[:14]

# CONSTANTS
P = 0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF
shared_key = derive_key(1)
alice_msg = b'wearecompromised'
success = b'allgoodprintflag'

def main():
    conn = process(['python3', 'chal.py']) #remote(HOST, PORT, ssl=True, sni=HOST)
    def rec_next():
        conn.recvuntil(b"msg:", timeout=2)
        data = conn.recvline(timeout=2).decode().strip()
        return data
    
    # 1) Bob -> Alice DH: P-1
    rec_next()
    conn.sendline(str(P-1).encode())
    # 2) Alice -> Bob DH: P-1
    rec_next()
    conn.sendline(str(P-1).encode())
    # 3) Bob -> Alice protocol: choose CMAC
    rec_next()
    conn.sendline(b"CMAC")
    # 4) Alice -> Bob protocol: choose CMAC
    rec_next()
    conn.sendline(b"CMAC")
    # 5) Bob -> Alice KDF nonce: no change
    alice_ctx2 = rec_next()
    conn.sendline(b"")
    # 6) Alice -> Bob KDF nonce: forge
    bob_ctx1 = rec_next()
    context = bytes.fromhex(bob_ctx1) + bytes.fromhex(alice_ctx2)
    alice_OTP = SP800_108_Counter(shared_key, 16, CMAC_PRF, 1, b'keygen_for_secure_bagdrop', context)
    # Wanted OTP from CMAC Counter Mode
    bagdrop = xor(alice_msg, alice_OTP)
    needed_t = xor(bagdrop, success)
    bob_forward_ctx = SP800_108_Counter_reverse(shared_key, 16, needed_t, b'keygen_for_secure_bagdrop', bytes.fromhex(alice_ctx2))
    conn.sendline(bob_forward_ctx.hex().encode())
    
    #recieve flag (maybe)
    conn.interactive()

if __name__ == '__main__':
    main()
```

We just repeat the execution a few times, until the odds are in our favor and we receive the flag:
```
dach2025{But_n1st_said_it_was_fine?!???_15f7a069}
```

### Mitigation
- Simple: DO NOT use CMAC with DH. Various documentation and even NIST say that using CMAC in this way for message authentication should be avoided.
- Instead, use HMAC and KMAC, which were valid options in this challenge. 
- If you need to use CMAC in this way, hope that the attacker controls far less than 16 bytes, which would exponentially increase the required brute-force (but may still be possible).