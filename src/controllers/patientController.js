const prisma = require("../lib/prisma");

const getAllPatients = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { lastName: "asc" },
        include: { _count: { select: { appointments: true } } },
      }),
      prisma.patient.count({ where }),
    ]);
    res.json({
      success: true,
      data: patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        appointments: {
          orderBy: { startTime: "asc" },
          where: { startTime: { gte: new Date() } },
        },
      },
    });
    if (!patient) {
      const err = new Error("Patient non trouvé.");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};

const createPatient = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth } = req.body;
    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    });
    res.status(201).json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth } = req.body;
    const patient = await prisma.patient.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(dateOfBirth !== undefined && {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        }),
      },
    });
    res.json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    await prisma.patient.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: "Patient supprimé." });
  } catch (err) {
    next(err);
  }
};

const getPatientAppointments = async (req, res, next) => {
  try {
    const { status, upcoming } = req.query;
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!patient) {
      const err = new Error("Patient non trouvé.");
      err.statusCode = 404;
      return next(err);
    }
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: parseInt(req.params.id),
        ...(status && { status }),
        ...(upcoming === "true" && { startTime: { gte: new Date() } }),
      },
      orderBy: { startTime: "asc" },
    });
    res.json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientAppointments,
};
