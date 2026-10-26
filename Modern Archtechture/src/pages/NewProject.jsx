import AppShell, { SiteFooter } from "../components/AppShell.jsx";
import StepForm from "../components/StepForm.jsx";
import { PHASES } from "../data/index.js";

const steps = [
  {
    label: "Project Basics",
    title: "Let's start with the basic information",
    subtitle: "Tell us what you want to build.",
    rows: [
      [
        {
          name: "projectName",
          type: "text",
          label: "Project name",
          placeholder: "Eg. Modern Villa",
          required: true,
        },
        {
          name: "projectType",
          type: "select",
          label: "Project type",
          placeholder: "Select type",
          options: [
            "Residential Architecture",
            "Commercial Architecture",
            "Interior Design",
            "Hospitality",
            "Mixed-Use",
            "Consultation",
          ],
          required: true,
        },
      ],
      [
        {
          name: "address",
          type: "text",
          label: "Site address",
          placeholder: "Street, district, city",
          required: true,
        },
        {
          name: "area",
          type: "text",
          label: "Floor area (m²)",
          placeholder: "Eg. 420",
        },
      ],
      [
        {
          name: "brief",
          type: "textarea",
          label: "Project brief",
          placeholder: "Describe your vision, lifestyle and requirements",
        },
      ],
    ],
  },
  {
    label: "Site & Budget",
    title: "Site details and budget",
    subtitle:
      "These help us plan the structure, materials and timeline. Fields are optional.",
    rows: [
      [
        {
          name: "budget",
          type: "number",
          label: "Estimated budget (USD)",
          placeholder: "Eg. 420000",
        },
        { name: "startDate", type: "date", label: "Target start date" },
      ],
      [
        {
          name: "soil",
          type: "select",
          label: "Soil condition",
          placeholder: "Select",
          options: [
            "Rocky",
            "Clay",
            "Sandy",
            "Mixed",
            "Unknown — survey needed",
          ],
        },
        {
          name: "floors",
          type: "select",
          label: "Number of floors",
          placeholder: "Select",
          options: ["1", "2", "3", "4–6", "7+"],
        },
      ],
      [
        {
          name: "constraints",
          type: "textarea",
          label: "Site constraints & permits",
          placeholder:
            "Access limits, neighbouring structures, permits already obtained",
        },
      ],
    ],
  },
  {
    label: "Team & Schedule",
    title: "Plan for the build",
    subtitle:
      "Choose a starting phase and add contacts to keep with this project.",
    rows: [
      [
        {
          name: "phase",
          type: "select",
          label: "Starting phase",
          placeholder: "Select phase",
          options: PHASES.map((p) => p.label),
        },
        {
          name: "lead",
          type: "select",
          label: "Project lead",
          placeholder: "Select team member",
          options: [
            "Emma Rodriguez",
            "Michael Chen",
            "Sarah Johnson",
            "Ahmad Karimi",
          ],
        },
      ],
      [
        {
          name: "siteContact",
          type: "text",
          label: "Site contact",
          placeholder: "Name and phone number (optional)",
        },
      ],
      [
        {
          name: "notes",
          type: "textarea",
          label: "Notes",
          placeholder: "Anything else you'd like us to know",
        },
      ],
    ],
  },
];

export default function NewProject() {
  return (
    <AppShell crumb="My Projects" title="My Projects">
      <StepForm
        title="Start Your Project"
        subtitle="Ready to transform your space? Add a new project and keep its brief, site and team in one place."
        steps={steps}
        initialValues={{ 2: { phase: "Discovery" } }}
        finishLabel="Save project"
      />
      <SiteFooter />
    </AppShell>
  );
}
