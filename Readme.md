# WebGL Game of Life

This project implements the rules of Conway's Game of Life as a web application, using WebGL shaders.

## Why

Simply because it's possible 😀

The idea behind is that modern GPUs, being massively parallelized, are kind of an ideal hardware to run Game of Life simulations. The CPU only has to give a few orders, and the GPU will do all the computations on its own.

This idea is not really new, and in fact I had implemented it using XNA back in the days. The ESSL shader running the simulation in this web app is a direct conversion from the HLSL shader I created a few years ago.

## Features

 * Runs a Game of Life simulation into a WebGL HTML5 canvas
 * The simulation is using periodic boundary conditions
 * Zooming and panning using the middle mouse button
 * Draw points (make cells alive) using the left mouse button
 * Erase points (kill cells) using the right mouse button
 * Optional grid display

## How to build

This project is built using ASP.NET Core. Make sure you have the latest tooling installed, and simply build the project.