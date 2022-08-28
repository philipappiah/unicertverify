from rest_framework import serializers


from .models import Issuer,Trustee, Applicant, Certificate, ViewRequest, ProofRequest

class IssuerSerializer(serializers.ModelSerializer[Issuer]):
    class Meta:
        model = Issuer
        fields = [
            "address",
            "name",
            "email",
            "admin",
            "website",
            "location_address",
            "country",
            "zipcode",
            "telephone",
            "trustees",
            "docs",
            "size",
            "logo",
            "terms_agreed",
            "gdpr_agreed",
            "privacy_agreed",
            "is_approved"
           
        ]
    



class ApplicantSerializer(serializers.ModelSerializer[Applicant]):
    class Meta:
        model = Applicant
        
        fields = [
            "address",
            "fullname",
            "is_trustee",
            "issuer",
            "email",
            "phone"
            
        ]




class TrusteeSerializer(serializers.ModelSerializer[Trustee]):
    class Meta:
        model = Trustee
        fields = [
            "issuer",
            "trustees"
        ]
        
    
  


class CertificateSerializer(serializers.ModelSerializer[Certificate]):
    class Meta:
        model = Certificate
        applicant = Applicant
        fields = [
            "address",
            "applicant"
            
        ]




class ProofRequestSerializer(serializers.ModelSerializer[ProofRequest]):
    class Meta:
        model = ProofRequest
        issuer = Issuer
        applicant = Applicant
        certificate = Certificate
        fields = [
            "reference",
            "applicant",
            "issuer",
            "deg_name",
            "deg_type",
            "deg_class",
            "course",
            "college",
            "student_num",
            "date_awarded",
            "major",
            "minor",
            "ipfs_hash",
            "completion_month",
            "completion_year",
            "message",
            "certificate",
            "signatures",
            "tx_hash",
            "data_hash",
            "signers",
            "has_affirmation",
            "affirmation_statement",
            "no_of_signers",
            "required_signers",
            
            "status",
            "created_at",
            "modified_at"
            
        ]


class ViewRequestSerializer(serializers.ModelSerializer[ViewRequest]):
    class Meta:
        model = ViewRequest
        fields = [
            "id",
            "certificate",
            "owner_approved",
            "confirmations",
            "request_address",
            "request_Status",
            "created_at",
            "modified_at"
            
        ]



    
