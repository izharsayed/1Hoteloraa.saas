"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _helpers = require('../../shared/helpers');
var _vendorsservice = require('./vendors.service'); var vendorService = _interopRequireWildcard(_vendorsservice);

 const listVendors = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const search = req.query.search ;
    const vendors = await vendorService.getVendors(tenantId, search);
    _helpers.sendSuccess.call(void 0, res, vendors, 'Vendors retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.listVendors = listVendors;

 const getVendor = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const vendor = await vendorService.getVendorById(tenantId, id);
    _helpers.sendSuccess.call(void 0, res, vendor, 'Vendor retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getVendor = getVendor;

 const createVendor = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const vendor = await vendorService.createVendor(tenantId, req.body);
    _helpers.sendSuccess.call(void 0, res, vendor, 'Vendor created successfully', 201);
  } catch (err) {
    next(err);
  }
}; exports.createVendor = createVendor;

 const updateVendor = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const vendor = await vendorService.updateVendor(tenantId, id, req.body);
    _helpers.sendSuccess.call(void 0, res, vendor, 'Vendor updated successfully');
  } catch (err) {
    next(err);
  }
}; exports.updateVendor = updateVendor;

 const deleteVendor = async (
  req,
  res,
  next
) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    await vendorService.deleteVendor(tenantId, id);
    _helpers.sendSuccess.call(void 0, res, null, 'Vendor deleted successfully');
  } catch (err) {
    next(err);
  }
}; exports.deleteVendor = deleteVendor;
