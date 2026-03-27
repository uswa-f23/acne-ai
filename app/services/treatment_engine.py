from typing import List, Dict, Any

# Treatment database — rule-based lookup
TREATMENT_DATABASE = {
    "medicated": [
        {
            "name": "Benzoyl Peroxide 2.5% Gel",
            "active_ingredient": "Benzoyl Peroxide",
            "description": "Kills acne-causing bacteria and reduces inflammation.",
            "application_method": "Apply thin layer to affected areas after cleansing.",
            "frequency": "Once daily at night",
            "severity": ["mild", "moderate", "severe", "very_severe"],
            "acne_types": ["papules", "pustules", "cysts", "nodules"]
        },
        {
            "name": "Salicylic Acid 2% Cleanser",
            "active_ingredient": "Salicylic Acid",
            "description": "Unclogs pores and prevents future breakouts.",
            "application_method": "Use as face wash twice daily.",
            "frequency": "Twice daily",
            "severity": ["mild", "moderate"],
            "acne_types": ["blackheads", "whiteheads", "comedones", "papules"]
        },
        {
            "name": "Adapalene 0.1% Gel (Differin)",
            "active_ingredient": "Adapalene (Retinoid)",
            "description": "Regulates skin cell turnover and reduces clogged pores.",
            "application_method": "Apply pea-sized amount to entire face at night.",
            "frequency": "Once daily at night",
            "severity": ["moderate", "severe", "very_severe"],
            "acne_types": ["blackheads", "whiteheads", "papules", "pustules"]
        },
        {
            "name": "Clindamycin 1% Topical Solution",
            "active_ingredient": "Clindamycin (Antibiotic)",
            "description": "Topical antibiotic that reduces acne-causing bacteria.",
            "application_method": "Apply to affected areas with a cotton pad.",
            "frequency": "Twice daily",
            "severity": ["moderate", "severe"],
            "acne_types": ["papules", "pustules", "cysts"]
        },
        {
            "name": "Isotretinoin (Accutane) — Consult Dermatologist",
            "active_ingredient": "Isotretinoin",
            "description": "Powerful oral retinoid for severe cystic acne. Requires prescription.",
            "application_method": "Oral medication — consult dermatologist.",
            "frequency": "As prescribed",
            "severity": ["severe", "very_severe"],
            "acne_types": ["cysts", "nodules"]
        },
    ],
    "herbal": [
        {
            "name": "Neem + Turmeric Face Mask",
            "description": "Anti-bacterial and anti-inflammatory natural remedy.",
            "application_method": "Mix neem powder and turmeric with rose water. Apply for 15 min.",
            "frequency": "3 times per week",
            "severity": ["mild", "moderate", "severe", "very_severe"],
            "acne_types": ["papules", "pustules", "blackheads", "whiteheads"]
        },
        {
            "name": "Tea Tree Oil Spot Treatment",
            "description": "Natural antibacterial oil that reduces inflammation.",
            "application_method": "Dilute with carrier oil (1:9 ratio). Apply to spots with cotton bud.",
            "frequency": "Once or twice daily",
            "severity": ["mild", "moderate"],
            "acne_types": ["papules", "pustules", "blackheads"]
        },
        {
            "name": "Aloe Vera Gel",
            "description": "Soothes irritated skin and reduces redness.",
            "application_method": "Apply pure aloe vera gel to face. Leave overnight.",
            "frequency": "Daily",
            "severity": ["mild", "moderate", "severe", "very_severe"],
            "acne_types": ["papules", "pustules", "cysts", "nodules"]
        },
        {
            "name": "Honey + Cinnamon Mask",
            "description": "Natural antimicrobial mask that fights acne bacteria.",
            "application_method": "Mix 2 tbsp honey with 1 tsp cinnamon. Apply for 10-15 min.",
            "frequency": "2 times per week",
            "severity": ["mild", "moderate"],
            "acne_types": ["blackheads", "whiteheads", "papules"]
        },
    ]
}

LIFESTYLE_TIPS = [
    "Avoid touching your face throughout the day.",
    "Change pillowcases every 2-3 days.",
    "Drink at least 2L of water daily.",
    "Avoid sugary and processed foods.",
    "Cleanse face twice daily with a gentle cleanser.",
    "Never pop or squeeze pimples.",
    "Use non-comedogenic skincare and makeup products.",
    "Manage stress through exercise or meditation.",
]

SEE_DERMATOLOGIST_SEVERITIES = ["severe", "very_severe"]


def get_treatments(severity: str, acne_types: List[str]) -> List[Dict[str, Any]]:
    """
    Rule-based treatment lookup.
    Returns list of treatment dicts matching severity and acne types.
    """
    recommendations = []

    for category in ["medicated", "herbal"]:
        for treatment in TREATMENT_DATABASE[category]:
            # Check if severity matches
            severity_match = severity in treatment["severity"]

            # Check if any acne type matches
            type_match = any(t in treatment["acne_types"] for t in acne_types)

            if severity_match and type_match:
                recommendations.append({
                    "type": category,
                    "name": treatment["name"],
                    "description": treatment["description"],
                    "active_ingredient": treatment.get("active_ingredient", ""),
                    "application_method": treatment["application_method"],
                    "frequency": treatment["frequency"],
                })

    return recommendations


def get_lifestyle_tips(severity: str) -> List[str]:
    """Return lifestyle tips based on severity."""
    if severity in ["severe", "very_severe"]:
        return LIFESTYLE_TIPS  # All tips for severe cases
    return LIFESTYLE_TIPS[:5]  # First 5 for mild/moderate


def should_see_dermatologist(severity: str) -> bool:
    return severity in SEE_DERMATOLOGIST_SEVERITIES