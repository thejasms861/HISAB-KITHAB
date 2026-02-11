import re
from rest_framework.serializers import ValidationError

def validate_indian_phone(value):
    """
    Validates that the input is a valid 10-digit Indian phone number.
    Accepts: +91 9876543210, 9876543210, +919876543210
    Returns: 10-digit sanitized number string.
    Raises: ValidationError if invalid.
    """
    # Remove spaces, hyphens
    cleaned = re.sub(r'[\s\-]', '', str(value))
    
    # Check regex for optional +91 and 10 digits
    # Pattern: Optional (+91), then exactly 10 digits
    pattern = r'^(\+91)?[0-9]{10}$'
    
    if not re.match(pattern, cleaned):
        raise ValidationError("Phone number must be a valid 10-digit Indian number.")
    
    # Extract last 10 digits to store standard format
    return cleaned[-10:]
