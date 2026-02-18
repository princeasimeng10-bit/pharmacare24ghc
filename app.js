<script>
const supabaseUrl = "https://mjoknzqvxexpuchdqwjm.supabase.co";
const supabaseKey = "sb_publishable_eyvI6pGV3JDqsxeqlj34LA_Bna6Yt9Q";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById("patientForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const file = formData.get("prescription_file");

  let prescriptionUrl = null;

  if (file && file.size > 0) {
    const fileName = Date.now() + "_" + file.name;

    const { data, error } = await supabaseClient.storage
      .from("prescriptions")
      .upload(fileName, file);

    if (!error) {
      prescriptionUrl = `${supabaseUrl}/storage/v1/object/public/prescriptions/${fileName}`;
    }
  }

  const requestData = {
    patient_name: formData.get("patient_name"),
    phone: formData.get("phone"),
    symptoms: formData.get("symptoms"),
    allergies: formData.get("allergies"),
    delivery_type: formData.get("delivery_type"),
    request_callback: formData.get("request_callback") === "true",
    doctor_referral: formData.get("doctor_referral") === "true",
    prescription_url: prescriptionUrl
  };

  const { error } = await supabaseClient
    .from("requests")
    .insert([requestData]);

  if (!error) {
    alert("Request Submitted Successfully");
    form.reset();
  } else {
    alert("Submission failed");
    console.log(error);
  }
});
</script>
