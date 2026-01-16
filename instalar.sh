#!/bin/bash
# Script para instalar el frontend

echo "╔═══════════════════════════════════════════════════════╗"
echo "║      Instalación del Frontend - Portal USEBEQ        ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Debes ejecutar este script desde el directorio frontend/"
    exit 1
fi

# Instalar dependencias
echo "📥 Instalando dependencias de Node.js..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo ""

# Verificar archivo .env
if [ -f ".env" ]; then
    echo "✅ Archivo .env configurado"
else
    echo "⚠️  Archivo .env no encontrado"
    echo "   Copiando desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║       ✅ Frontend instalado correctamente             ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "Para iniciar el servidor de desarrollo:"
echo "  npm run dev"
echo ""
