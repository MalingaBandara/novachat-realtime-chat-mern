
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const socket = require('socket.io');
const userRouter = require('./routes/userRoutes'); 