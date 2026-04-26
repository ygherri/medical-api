const prisma = require("../lib/prisma");

const checkOverlap = async (
  doctorName,
  startTime,
  endTime,
  excludeId = null,
) => {
  return prisma.appointment.findFirst({
    where: {
      doctorName,
      status: { notIn: ["CANCELLED"] },
      AND: [
        { startTime: { lt: new Date(endTime) } },
        { endTime: { gt: new Date(startTime) } },
      ],
      ...(excludeId && { id: { not: excludeId } }),
    },
    include: { patient: { select: { firstName: true, lastName: true } } },
  });
};

const getAllAppointments = async (req, res, next) => {
  try {
    const { status, doctorName, from, to, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
      ...(status && { status }),
      ...(doctorName && { doctorName: { contains: doctorName } }),
      ...((from || to) && {
        startTime: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    };
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { startTime: "asc" },
        include: {
          patient: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      prisma.appointment.count({ where }),
    ]);
    res.json({
      success: true,
      data: appointments,
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

const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    if (!appointment) {
      const err = new Error("Rendez-vous non trouvé.");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

const createAppointment = async (req, res, next) => {
  try {
    const { patientId, doctorName, reason, startTime, endTime, notes } =
      req.body;
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) },
    });
    if (!patient) {
      const err = new Error("Patient non trouvé.");
      err.statusCode = 404;
      return next(err);
    }
    const overlap = await checkOverlap(doctorName, startTime, endTime);
    if (overlap)
      return res
        .status(409)
        .json({
          success: false,
          error: "Chevauchement",
          message: `${doctorName} est déjà occupé sur ce créneau (RDV #${overlap.id} avec ${overlap.patient.firstName} ${overlap.patient.lastName}).`,
        });
    const appointment = await prisma.appointment.create({
      data: {
        patientId: parseInt(patientId),
        doctorName,
        reason: reason || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes: notes || null,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { doctorName, reason, startTime, endTime, status, notes } = req.body;
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      const err = new Error("Rendez-vous non trouvé.");
      err.statusCode = 404;
      return next(err);
    }
    if (doctorName || startTime || endTime) {
      const overlap = await checkOverlap(
        doctorName || existing.doctorName,
        startTime || existing.startTime,
        endTime || existing.endTime,
        id,
      );
      if (overlap)
        return res
          .status(409)
          .json({
            success: false,
            error: "Chevauchement",
            message: `Créneau déjà occupé (RDV #${overlap.id}).`,
          });
    }
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(doctorName && { doctorName }),
        ...(reason !== undefined && { reason }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    res.json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    await prisma.appointment.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: "Rendez-vous supprimé." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
