#!/usr/bin/env python
"""
build_crypto.py — Compile demo_crypto.exe
Requires: MinGW (gcc in PATH)
"""
import subprocess
import sys
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
src  = os.path.join(script_dir, "demo_crypto.c")
out  = os.path.join(script_dir, "demo_crypto.exe")

cmd = [
    "gcc",
    "-O1",           # léger optimisation (garder les fonctions séparées)
    "-s",            # strip symbols
    "-o", out,
    src,
    "-ladvapi32",    # WinCrypt
]

print(f"[*] Compilation : {' '.join(cmd)}")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("[!] Erreur de compilation :")
    print(result.stderr)
    sys.exit(1)

print(f"[+] Binaire généré : {out}")

# Verify: quick sanity check with RC4
def rc4(key, data):
    S = list(range(256))
    j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) & 0xFF
        S[i], S[j] = S[j], S[i]
    i = j = 0
    result = []
    for byte in data:
        i = (i + 1) & 0xFF
        j = (j + S[i]) & 0xFF
        S[i], S[j] = S[j], S[i]
        result.append(byte ^ S[(S[i] + S[j]) & 0xFF])
    return bytes(result)

key  = b"Z2P_K3Y"
flag = b"zero_to_pro{crypt0_4nalys15_m4st3r}"
ct   = rc4(key, flag)
dec  = rc4(key, ct)
assert dec == flag, "RC4 sanity check failed"
print(f"[+] Sanity check RC4 : OK — flag = {flag.decode()}")
print(f"[+] Ciphertext  : {ct.hex()}")
