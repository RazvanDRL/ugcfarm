// import type { NextConfig } from "next";
const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy({
	customDomain: "https://plausible.longtoshort.tech",
})({

})
