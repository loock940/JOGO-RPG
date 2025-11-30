#!/usr/bin/env pwsh
# Script PowerShell para compilar e executar o jogo Java
Write-Host "Compilando Main.java..."
javac Main.java
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falha na compilação. Verifique o JDK e o código fonte."
    exit 1
}

Write-Host "Executando..."
java Main
